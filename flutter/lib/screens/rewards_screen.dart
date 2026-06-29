import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/rewards_provider.dart';
import '../widgets/stitch_divider.dart';

class RewardsScreen extends ConsumerWidget {
  const RewardsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rewards = ref.watch(rewardsProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF4),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFDFBF4),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/home'),
        ),
        title: const Text('포인트 내역', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // 총 포인트
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const Text('내 포인트', style: TextStyle(fontSize: 16, color: Color(0xFF8C8C8C))),
                    Text('${rewards.points} pt', style: const TextStyle(fontSize: 52, fontWeight: FontWeight.w700)),
                    Text('🔥 ${rewards.streak}일 연속 기상', style: const TextStyle(fontSize: 16)),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: (rewards.points / 500).clamp(0.0, 1.0),
                        minHeight: 14,
                        backgroundColor: const Color(0xFFEEEEEE),
                        valueColor: const AlwaysStoppedAnimation(Color(0xFF7EC8A4)),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text('목표 500pt | ${500 - rewards.points}pt 남음',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF8C8C8C))),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const StitchDivider(),
            // 기프티콘
            const Align(
              alignment: Alignment.centerLeft,
              child: Text('🎁 기프티콘 교환', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
            ),
            const SizedBox(height: 12),
            _GifticonCard(emoji: '☕', name: '스타벅스 아메리카노', pts: 500, current: rewards.points),
            const SizedBox(height: 8),
            _GifticonCard(emoji: '🏪', name: 'CU 3천원권', pts: 300, current: rewards.points),
          ],
        ),
      ),
    );
  }
}

class _GifticonCard extends StatelessWidget {
  final String emoji;
  final String name;
  final int pts;
  final int current;

  const _GifticonCard({required this.emoji, required this.name, required this.pts, required this.current});

  @override
  Widget build(BuildContext context) {
    final canExchange = current >= pts;
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 30)),
            const SizedBox(width: 12),
            Expanded(child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                Text('$pts pt', style: const TextStyle(fontSize: 14, color: Color(0xFF8C8C8C))),
              ],
            )),
            ElevatedButton(
              onPressed: canExchange ? () {} : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: canExchange ? const Color(0xFFF4A228) : const Color(0xFFEEEEEE),
                side: BorderSide(color: canExchange ? const Color(0xFF2D2D2D) : Colors.transparent, width: 1.5),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: Text(canExchange ? '교환' : '부족', style: TextStyle(color: canExchange ? const Color(0xFF2D2D2D) : const Color(0xFF8C8C8C))),
            ),
          ],
        ),
      ),
    );
  }
}
