import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/motion_provider.dart';
import '../services/alarm_api_service.dart';
import '../widgets/stitch_divider.dart';

class AlarmRingScreen extends ConsumerStatefulWidget {
  const AlarmRingScreen({super.key});

  @override
  ConsumerState<AlarmRingScreen> createState() => _AlarmRingScreenState();
}

class _AlarmRingScreenState extends ConsumerState<AlarmRingScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _shakeCtrl;

  @override
  void initState() {
    super.initState();
    _shakeCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    )..repeat(reverse: true);

    ref.read(motionProvider.notifier).start(
      onVoipTrigger: _handleVoipTrigger,
    );
  }

  @override
  void dispose() {
    _shakeCtrl.dispose();
    ref.read(motionProvider.notifier).stop();
    super.dispose();
  }

  Future<void> _handleVoipTrigger() async {
    await AlarmApiService.triggerVoip();
  }

  void _confirmAwake() {
    ref.read(motionProvider.notifier).stop();
    AlarmApiService.confirmWake();
    context.go('/complete');
  }

  @override
  Widget build(BuildContext context) {
    final motion = ref.watch(motionProvider);
    final isUrgent = motion.timeUntilCall <= 30;
    final progress = (motion.noMotionSeconds / 180).clamp(0.0, 1.0);

    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF4),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [

              // ── 알람 박스 ──
              AnimatedBuilder(
                animation: _shakeCtrl,
                builder: (_, child) => Transform.translate(
                  offset: isUrgent ? Offset(_shakeCtrl.value * 6 - 3, 0) : Offset.zero,
                  child: child,
                ),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: isUrgent ? const Color(0xFFFFF0F0) : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isUrgent ? Colors.red : const Color(0xFF2D2D2D),
                      width: 3,
                    ),
                    boxShadow: [
                      BoxShadow(
                        offset: const Offset(6, 6),
                        color: isUrgent ? Colors.red : const Color(0xFF2D2D2D),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Text(isUrgent ? '😱' : 'ヽ(°〇°)ﾉ', style: const TextStyle(fontSize: 52)),
                      Text(
                        TimeOfDay.now().format(context),
                        style: const TextStyle(fontSize: 56, fontWeight: FontWeight.w700),
                      ),
                      Text(
                        isUrgent ? '!! 전화 곧 옵니다 !!' : '!! 일어나세요 !!',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: isUrgent ? Colors.red : const Color(0xFF2D2D2D),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // ── 미기상 프로그레스 ──
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        motion.noMotionSeconds < 5
                            ? '📳 움직임 감지 중...'
                            : '😴 ${motion.noMotionSeconds}초째 미기상',
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(
                        value: progress,
                        backgroundColor: const Color(0xFFEEEEEE),
                        valueColor: AlwaysStoppedAnimation(
                          isUrgent ? Colors.red : const Color(0xFFA8C9F0),
                        ),
                        minHeight: 14,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('0', style: TextStyle(fontSize: 12, color: Color(0xFF8C8C8C))),
                          Text(
                            isUrgent
                                ? '📞 ${motion.timeUntilCall}초 후 전화!'
                                : '전화까지 ${motion.timeUntilCall}초',
                            style: TextStyle(
                              fontSize: 12,
                              color: isUrgent ? Colors.red : const Color(0xFF8C8C8C),
                              fontWeight: isUrgent ? FontWeight.w700 : FontWeight.normal,
                            ),
                          ),
                          const Text('3분', style: TextStyle(fontSize: 12, color: Color(0xFF8C8C8C))),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),
              const StitchDivider(),
              const SizedBox(height: 20),

              // ── 버튼 ──
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _confirmAwake,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7EC8A4),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    side: const BorderSide(color: Color(0xFF2D2D2D), width: 2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ).copyWith(
                    shadowColor: WidgetStateProperty.all(Colors.transparent),
                  ),
                  child: const Text('나 일어났어요! ✓', style: TextStyle(fontSize: 20, color: Color(0xFF2D2D2D))),
                ),
              ),

              const SizedBox(height: 12),

              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => context.go('/home'),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: const Color(0xFFA8C9F0),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    side: const BorderSide(color: Color(0xFF2D2D2D), width: 2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('5분만 더... 😴', style: TextStyle(fontSize: 20, color: Color(0xFF2D2D2D))),
                ),
              ),

              const SizedBox(height: 16),
              Text(
                '움직임이 없으면 3분 후 전화드려요',
                style: const TextStyle(fontSize: 14, color: Color(0xFF8C8C8C)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
